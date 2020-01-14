import { useMachine } from 'react-robot';
import React from 'react';
import {createMachine, guard, state, transition, action} from 'robot3';

const isFuture = () => true;

const accept = () => {
  console.log("accepted!")
}

const machine = createMachine({
  applied: state(
    transition('accept', 'accepted', guard(isFuture), action(accept)),
    transition('reject', 'rejected')
  ),
  accepted: state(transition('cancel', 'cancelled')),
  rejected: state(),
  cancelled: state(),

});

export default function App() {
  const [current, send] = useMachine(machine);
  const transitions = current.value.transitions;

  return (<>
    {transitions.has('accept') && <button type="button" onClick={() => send('accept')}>Accept</button>}
    {transitions.has('reject') && <button type="button" onClick={() => send('reject')}>Reject</button>}
    {transitions.has('cancel') && <button type="button" onClick={() => send('cancel')}>Cancel</button>}
    State: {current.name}
    </>)
}