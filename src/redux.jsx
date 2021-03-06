import React,{useState,useContext,useEffect} from 'react';

let state = undefined
let reducer = undefined
let linsterners = [] //存放了全部组件的更新函数，当store变化的时候，会导致所有组件都更新
const setState = (newState)=>{   //store的setState不是hooks的setState
    state = newState
    linsterners.map(fn=>fn(store.state)) //setState的时候，订阅了store变化的监听者都进行函数回调
}
const store = {
    getState(){
        return state
    },
    dispatch :(action)=>{
        setState(reducer(state,action))
    },
    subscribe(fn){
        //store发生变化时要执行的函数放入数组里
        linsterners.push(fn)
        return ()=>{  //return的函数可以取消订阅
            const index = linsterners.indexOf(fn)
            linsterners.splice(index,1)
        }
    }
}

let dispatch = store.dispatch
const preDispatch = dispatch
dispatch = (action)=>{
    if(action instanceof Function){
        action(dispatch)
    }else{
        preDispatch(action)
    }
}

const preDispatch2 = dispatch
dispatch = (action)=>{
    if(action.payload instanceof Promise){
        action.payload.then(
            data=>{
                dispatch({...action,payload:data})
            }
        )
    }else{
        preDispatch2(action)
    }
}



const appContext = React.createContext(null);
export const Provider =({store,children})=>{
    return(
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}
export const createStore = (_reducer,initState)=>{
    state = initState
    reducer = _reducer
    return store
}

const changed = (oldState,newState)=>{
    let changed =false
    for(let key in oldState){
        if(oldState[key] !== newState[key]){
            changed = true
            break;
        }
    }
    return changed
}
export const connect = (selector,dispatchSelector) => (Component) =>{  //柯里化
    return (props)=>{  //接受一个组件，返回一个组件
        const[,update] = useState({})
        const data =selector ? selector(state) :{state:state}  //如果传了state就是局部的state,没传就是全局的state
        const dispatchers =dispatchSelector ? dispatchSelector(dispatch) : {dispatch}
        //订阅store
        useEffect(()=>
                //useEffect有return的话，会在组件销毁之前执行；如果有多次渲染，就会在执行下一个effect之前，上一个effect被清除的时候执行return的函数
                store.subscribe(()=>{   //第一次执行时，会订阅store(就是传一个回调函数给store先存起来),当数据变化后，会先触发dispatch改变数据，然后再执行这个回调函数
                    const newData = selector? selector(state) :{state:state}
                    if(changed(data,newData)){
                        console.log("changed")
                        update({})
                    }
                })
            ,[selector]) //如果不取消订阅，当加上state依赖时，会造成重复渲染，比如当二儿子改变两次时，大儿子和二儿子都会渲染两遍，因为每次state变化时，重复订阅了大儿子和二儿子，store.lisenters数组被push了多余的重复回调函数

        return <Component {...data} {...props} {...dispatchers} /> //返回的组件中又引入了子组件，子组件的props是包裹子组件的组件透传过来的
    }
}
