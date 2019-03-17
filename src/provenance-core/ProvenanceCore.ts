import { createNewGraph } from "./ProvenanceGraph";
import { configureStore } from "./Store";
import { deepCopy } from "../utils/utils";
import { Store } from "redux";
import { NodeID, isStateNode } from "./NodeInterfaces";
import { ReversibleAction } from "./ProvenanceActions";
import { applyAction, applyResetAction } from "./ApplyActionFunction";
import { toNode, toNodeWithState} from "./GotoNodeActions";

export function Provenance<T>(application: Store<T>, resetFunction: string = null) {
  const graph = configureStore(createNewGraph());

  return {
    graph: () => deepCopy(graph.getState()),
    apply: <D, U>(
      action: ReversibleAction<D, U>,
      skipFirstDoFunctionCall: boolean = false,
    ) => {
      applyAction(graph, application, action, skipFirstDoFunctionCall);
    },
    applyReset: () => {
      applyResetAction(graph, application, resetFunction)
    },
    goToNode: (id: NodeID) => toNode(graph, application, id),
    goToNodeWithState: (id: NodeID) => toNodeWithState(graph, application, id, resetFunction),
    goBackOneStep: () => {
      const current = graph.getState().current;
      if (isStateNode(current)) {
        toNode(graph, application, current.parent);
      }
    },
    goBackOneStepWithState: () => {
      const current = graph.getState().current;
      if (isStateNode(current)) {
        toNodeWithState(graph, application, current.parent, resetFunction);
      }
    },
    goBackNSteps: (n: number) => {
      while (n != 0) {
        const current = graph.getState().current;
        if (isStateNode(current)) {
          toNode(graph, application, current.parent);
          --n;
        } else {
          break;
        }
      }
    },
    goBackNStepsWithState: (n: number) => {
      while (n != 0) {
        const current = graph.getState().current;
        if (isStateNode(current)) {
          toNodeWithState(graph, application, current.parent, resetFunction);
          --n;
        } else {
          break;
        }
      }
    }
  };
}
