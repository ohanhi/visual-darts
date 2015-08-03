import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import _hh from 'hyperscript-helpers';

const { div, span, h1, a } = _hh(CycleDOM.h);

const main = () => ({
  DOM: Cycle.Rx.Observable.interval(1000)
    .map(i => h1(i + ' seconds elapsed'))
});

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);
