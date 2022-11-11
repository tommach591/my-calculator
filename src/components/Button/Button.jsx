import "./Button.css";

function Button({ value, updateInput }) {
  return (
    <div
      className="Button"
      onClick={() => {
        updateInput(value);
      }}
    >
      <h2>{value}</h2>
    </div>
  );
}

export default Button;
