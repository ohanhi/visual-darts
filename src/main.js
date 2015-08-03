import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import _hh from 'hyperscript-helpers';

const { div, span, h1, a, button } = _hh(CycleDOM.h);

const main = ({DOM}) => {

  let action$ = Cycle.Rx.Observable.merge(
    DOM.get('#decrement', 'click').map(ev => -1),
    DOM.get('#increment', 'click').map(ev => +1)
  );
  let count$ = action$.startWith(0).scan((x,y) => x+y);
  return {
    DOM: count$.map(count =>
        div([
          button({id: 'decrement'}, 'Decrement'),
          button({id: 'increment'}, 'Increment'),
          h1('Counter: ' + count)
        ])
      )
  };

};

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);
