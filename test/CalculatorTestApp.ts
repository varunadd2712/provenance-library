import { createStore, combineReducers } from "redux";

export enum CalcActionEnum {
  ADD = "ADD",
  DO_ADD = ADD,
  UNDO_SUB = ADD,
  SUB = "SUB",
  UNDO_ADD = SUB,
  DO_SUB = SUB,
  RESET_NOW = "RESET_NOW"
}

interface CalcAction {
  type: CalcActionEnum;
  args: number;
}

export const createAddAction = (toAdd: number): CalcAction => ({
  type: CalcActionEnum.ADD,
  args: toAdd
});

export const createSubAction = (toSub: number): CalcAction => ({
  type: CalcActionEnum.SUB,
  args: toSub
});

const calcReducer = (count: number = 0, action: CalcAction) => {
  switch (CalcActionEnum[action.type]) {
    case CalcActionEnum.ADD:
      return count + action.args;
    case CalcActionEnum.SUB:
      return count - action.args;
    case CalcActionEnum.RESET_NOW: {
        resettingNow(count);
        return -1;
    }
    default:
      return count;
  }
};

function resettingNow(count : number) {
  console.log("testing this");
  console.log(count);
}
export const Calculator = () =>
  createStore(
    combineReducers({
      count: calcReducer
    })
  );
