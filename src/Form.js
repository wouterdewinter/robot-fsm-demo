import { useMachine } from 'react-robot';
import React from 'react';
import { createMachine, state, transition, action, reduce } from 'robot3';
import { Container, Modal, Button, Input } from 'semantic-ui-react'

const context = () => ({
  hours: 8,
  newHours: null
});

const machine = createMachine({
  closed: state(
    transition('open', 'start'),
  ),
  start: state(
    transition('reject', 'incorrect', reduce(
      (context, event) => ({ ...context, newHours: context.hours }))
    ),
    transition('approve', 'finished', action(approve)),
    transition('close', 'closed')
  ),
  incorrect: state(
    transition('cancel', 'start'),
    transition('close', 'closed'),
    transition('submit', 'closed', action(submit), reduce(
      (context, event) => ({ ...context, hours: context.newHours }))
    ),
    transition('input', 'incorrect', reduce(
      (context, event) => ({ ...context, newHours: event.value }))
    )
  ),
  finished: state(
    transition('close', 'closed')
  ),
}, context);

export default function Form() {
  const [current, send] = useMachine(machine);
  const state = current.name;
  const { hours, newHours } = current.context;

  return (<Container>
    <h1>State: {state}, Hours: {hours}</h1>
    <Button onClick={() => send('open')}>Open modal</Button>
      <Modal open={state !== 'closed'} onClose={() => send('close')} closeIcon>
        <Modal.Header>Check your hours</Modal.Header>
        <Modal.Content>
          {state === 'start' && `Did you indeed work ${hours} hours?`}
          {state === 'finished' && "Thank you, you will receive the invoice shortly"}
          {state === 'incorrect' && <>
            <p>How many did you work then?</p>
            <Input value={newHours} onChange={(e, data) => send({ type: 'input', value: data.value}) }/>
          </>}
        </Modal.Content>
        <Modal.Actions>
          {state === 'start' && <Button negative onClick={() => send('reject')}>Change needed</Button>}
          {state === 'start' && <Button positive onClick={() => send('approve')}>Approve</Button>}
          {state === 'incorrect' && <Button onClick={() => send('cancel')}>Cancel change</Button>}
          {state === 'incorrect' && <Button primary onClick={() => send('submit')}>Submit</Button>}
        </Modal.Actions>
      </Modal>
    </Container>)
}

function approve(context) {
  // perform side effects
  console.log('approved hours ' + context.hours);
}

function submit(context) {
  // perform side effects
  console.log('submit hour change request ' + context.newHours);
}