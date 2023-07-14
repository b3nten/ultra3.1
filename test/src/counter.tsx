import React from "react"

export function Counter(props: { initialCount: number }){
	const [count, setCount] = React.useState(props.initialCount);
	return (
		<div>
			<button onClick={() => setCount((c) => c + 1)}>+</button>
			<button onClick={() => setCount((c) => c - 1)}>-</button>
			<div>count: {count}</div>
		</div>
	)
}