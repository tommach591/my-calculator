import { useState } from "react";
import "./Calculator.css";
import Button from "../Button";

function Calculator({ updateHistory }) {
  const [input, setInput] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const [lastButton, setLastButton] = useState("");

  const calcFormat = [
    ["(", ")", "%", "^", "CE"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "x"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  function calculate(newTokenList) {
    let curr = newTokenList.shift();
    if (curr === "-") curr += newTokenList.shift();

    let calculateSubProblem = () => {
      let subProblem = [curr];
      let stack = [curr];
      while (stack.length > 0) {
        if (newTokenList.length === 0) return "ERROR";
        curr = newTokenList.shift();
        subProblem.push(curr);
        if (curr === "(") stack.push(curr);
        else if (curr === ")") stack.pop();
      }
      subProblem = subProblem.slice(1, subProblem.length - 1);
      return calculate(subProblem);
    };

    if (curr === "(") curr = calculateSubProblem();
    let ans = parseFloat(curr);

    while (newTokenList.length > 0) {
      let curr = newTokenList.shift();
      switch (curr) {
        case "+":
          curr = newTokenList.shift();
          if (curr === "(") curr = calculateSubProblem();
          ans += parseFloat(curr);
          break;
        case "-":
          let temp = newTokenList.shift();
          if (temp === "(") temp = calculateSubProblem();
          ans += parseFloat(curr + temp);
          break;
        case "x":
          curr = newTokenList.shift();
          if (curr === "(") curr = calculateSubProblem();
          ans *= parseFloat(curr);
          break;
        case "(":
          curr = calculateSubProblem();
          ans *= parseFloat(curr);
          break;
        case "÷":
          curr = newTokenList.shift();
          if (curr === "(") curr = calculateSubProblem();
          ans /= parseFloat(curr);
          break;
        case "%":
          curr = newTokenList.shift();
          if (curr === "(") curr = calculateSubProblem();
          ans %= parseFloat(curr);
          break;
        case "^":
          curr = newTokenList.shift();
          if (curr === "(") curr = calculateSubProblem();
          ans **= parseFloat(curr);
          break;
        default:
          ans *= parseFloat(curr);
          break;
      }
    }

    return ans;
  }

  function updateInput(c) {
    let newInput = input;
    let newTokenList = tokenList;
    if ((lastButton === "=" && !"+-x÷%^=".includes(c)) || newInput === "ERROR")
      newInput = "";
    setLastButton(c);

    switch (c) {
      case "=":
        if (newInput !== "") {
          if (lastButton === ")") {
            newTokenList = newTokenList.concat(newInput.split(""));
          } else {
            newTokenList.push(newInput);
          }
        }
        let prevEntry = [...newTokenList];
        newInput = calculate(newTokenList);
        if (isNaN(newInput)) newInput = "ERROR";

        prevEntry = prevEntry.concat(["=", newInput]);
        prevEntry = prevEntry.join(" ");
        updateHistory(prevEntry);

        newTokenList = [];
        setTokenList(newTokenList);
        break;
      case "CE":
        if (newInput.length === 0 && newTokenList.length > 0)
          newInput = newTokenList.pop();
        newInput = newInput.slice(0, newInput.length - 1);
        if (newInput.length === 0 && newTokenList.length > 0)
          newInput = newTokenList.pop();
        break;
      case "(":
      case ")":
        if (
          newInput !== "" &&
          !newInput.includes("(") &&
          !newInput.includes(")")
        ) {
          newTokenList.push(newInput);
          newInput = "";
        }
        newInput += c;
        setTokenList(newTokenList);
        break;
      case "+":
      case "-":
      case "x":
      case "÷":
      case "%":
      case "^":
        if (!"+-x÷%^".includes(newInput)) {
          newTokenList.push(newInput);
          newInput = c;
          setTokenList(newTokenList);
        } else newInput = c;
        break;
      default:
        if ("+-x÷%^".includes(newInput) && newInput !== "") {
          newTokenList.push(newInput);
          setTokenList(newTokenList);
          newInput = "";
        } else if (newInput.includes("(") || newInput.includes(")")) {
          newTokenList = newTokenList.concat(newInput.split(""));
          setTokenList(newTokenList);
          newInput = "";
        }
        newInput += c;
        break;
    }
    setInput(newInput);
  }

  return (
    <div className="Calculator">
      <div className="Answer">
        <h2>{tokenList.join(" ") + ` ${input}`}</h2>
      </div>
      {calcFormat.map((list, i) => {
        return (
          <div className="Row" key={i}>
            {list.map((e) => {
              return <Button key={e} value={e} updateInput={updateInput} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Calculator;
