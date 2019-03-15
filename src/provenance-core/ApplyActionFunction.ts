import { Store, AnyAction } from "redux";
import { ProvenanceGraph } from "./ProvenanceGraph";
import { ReversibleAction, ResetAction, ResetActionCreator } from "./ProvenanceActions";
import { NodeID, StateNode } from "./NodeInterfaces";
import { generateUUID, generateTimeStamp } from "../utils/utils";
import {
  createAddNodeAction,
  createUpdateNewlyAddedNodeAction
} from "./NodeActions/ActionCreators";
import {
  createAddChildToCurrentAction,
  createChangeCurrentAction
} from "./CurrentActions/ActionCreators";

export function applyAction<T, D, U>(
  graph: Store<ProvenanceGraph, AnyAction>,
  application: Store<T>,
  action: ReversibleAction<D, U>,
  skipFirstDoFunctionCall: boolean = false) {

  const createNewStateNode = (
    parent: NodeID,
    actionResult: unknown
  ): StateNode => ({
    id: generateUUID(),
    label: action.type,

    metadata: {
      createdOn: generateTimeStamp()
    },
    action: action,
    actionResult: actionResult,
    parent: parent,
    children: [],
    artifacts: [],
    state: application.getState()
  });

  let newNode: StateNode;

  const currentNode = graph.getState().current;
  console.log("logging fun");
  console.log(action.doAction);
  if (!skipFirstDoFunctionCall) application.dispatch(action.doAction);
  newNode = createNewStateNode(currentNode.id, null);
  console.log("new node");
  console.log(newNode);
  // * Add to nodes list
  graph.dispatch(createAddNodeAction(newNode));
  // * Add as child to current node
  graph.dispatch(createAddChildToCurrentAction(newNode.id));
  // * Update the node in nodes list
  graph.dispatch(createUpdateNewlyAddedNodeAction(graph.getState().current));
  // * Change Current node
  graph.dispatch(createChangeCurrentAction(newNode));
}

export function applyResetAction<T, D, U>(
  graph: Store<ProvenanceGraph, AnyAction>,
  application: Store<T>,
  inputString: string) {

  let action = {type : inputString}

  console.log(action);

  const createResetAction = (toSet: any) : ResetAction<any> => {
    return ResetActionCreator(inputString, toSet);
  };

  application.dispatch(createResetAction(application.getState()));
}
