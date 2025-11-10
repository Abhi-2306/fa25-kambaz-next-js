"use client"
import React from 'react'
import ClickEvent from './ClickEvent'
import PassingDataOnEvent from './PassingDataOnEvent'
import PassingFunctions from './PassingFunctions'
import EventObject from './EventObject'
import Counter from './Counter'
import BooleanStateVariables from './BooleanStateVariable'
import StringStateVariables from './StringStateVariables'
import DateStateVariable from './DateStateVariable'
import ObjectStateVariable from './ObjectStateVariable'
import ArrayStateVariable from './ArrayStateVariable'
import ParentStateComponent from './ParentStateComponent'
import ReduxExamples from './ReduxExamples'
import { Provider } from 'react-redux'
import store from './store'

function Lab4() {
  function sayHello() {
    alert("Hello");
  }

  return (
    <Provider store={store}>
      <div>
        <h3 id="wd-passing-functions">Lab 4</h3>
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction={sayHello} />
        <EventObject />
        <Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <DateStateVariable />
        <ObjectStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
        <ReduxExamples />

      </div>
    </Provider>
  )
}

export default Lab4
