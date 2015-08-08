import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import _hh from 'hyperscript-helpers';

const { h1, div, ol, li } = _hh(CycleDOM.h);

function closest(selector, event) {
  const path = [].slice.call(event.path);
  const match = path.filter(el =>
    el !== window && el !== document && el.matches(selector));
  return (match.length > 0 ? match[0] : null);
}

function typeFromHref(href) {
  switch (href) {
    case "#outer":
    case "#inner":
      return "S";
    case "#triple":
      return "T";
    case "#double":
      return "D"
  }
  return null;
}

function decodeType(el) {
  return el.dataset.type || typeFromHref(el.getAttribute("xlink:href"));
}

// decodeClick : Event -> Maybe [ score, type ]
function decodeClick(event) {
  const match = closest('[data-score]', event);
  if (match) {
    const score = Number(match.dataset.score);
    const type = decodeType(event.target);
    return { score: score, type: type };
  } else {
    console.log("(no match)");
    return null;
  }
}

const anyClick = () => Cycle.Rx.Observable.fromEvent(document, 'click');

const main = ({DOM, anyClick$}) => {

  const state$ =
    anyClick$
      .map(decodeClick)
      .startWith({ hits: [], score: 0 })
      .filter(c => c !== null)
      .scan((acc, hit) => ({ hits: acc.hits.concat(hit), score: acc.score+hit.score }))
      .do(x => console.log(x));

  return {
    DOM: state$.map(state =>
        div([
          h1('Score: ' + (501 - state.score)),
          ol(
            state.hits.map(hit => li(hit.type+hit.score))
          )
        ])
      )
  };

};

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#app'),
  anyClick$: anyClick
};

Cycle.run(main, drivers);
