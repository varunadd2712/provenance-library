import { createNewGraph } from "./ProvenanceGraph";
import { configureStore } from "./Store";
import { deepCopy } from "../utils/utils";
import { Store } from "redux";
import { NodeID, isStateNode } from "./NodeInterfaces";
import { ReversibleAction, ResetAction } from "./ProvenanceActions";
import { applyAction, applyResetAction } from "./ApplyActionFunction";
import { toNode } from "./GotoNodeActions";

export function Provenance<T>(application: Store<T>) {
  const graph = configureStore(createNewGraph());

  return {
    graph: () => deepCopy(graph.getState()),
    apply: <D, U>(
      action: ReversibleAction<D, U>,
      skipFirstDoFunctionCall: boolean = false,
    ) => {
      applyAction(graph, application, action, skipFirstDoFunctionCall);
    },
    applyReset: (
      action: ResetAction,
      state:any
    ) => {
      applyResetAction(graph, application, action, state)
    },
    goToNode: (id: NodeID) => toNode(graph, application, id),
    goBackOneStep: () => {
      const current = graph.getState().current;
      if (isStateNode(current)) {
        toNode(graph, application, current.parent);
      }
    },
    goBackNSteps: (n: number, withState:boolean = false) => {
      while (n != 0) {
        const current = graph.getState().current;
        if (isStateNode(current)) {
          toNode(graph, application, current.parent);
          --n;
        } else {
          break;
        }
      }
    }
  };
}
