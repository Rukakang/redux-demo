import React,{useState,useContext,useEffect} from 'react';

export const appContext = React.createContext(null);

export const store = {
    state:{
        user:{
            name:'bobojier',
            age:18
        },
        group:{
            name:"前端组"
        }
    },
    setState(newState){   //store的setState不是hooks的setState
        console.log(store.linsterners)
        store.state = newState
        store.linsterners.map(fn=>fn(store.state)) //setState的时候，订阅了store变化的监听者都进行函数回调
    },
    linsterners:[], //存放了全部组件的更新函数，当store变化的时候，会导致所有组件都更新
    subscribe(fn){
        //store发生变化时要执行的函数放入数组里
        store.linsterners.push(fn)
        return ()=>{  //return的函数可以取消订阅
            const index = store.linsterners.indexOf(fn)
            store.linsterners.splice(index,1)
        }
    }
}
export const reducer = (state,{type,payload})=>{
    if(type === "updateState"){
        return {
            ...state,
            user:{
                ...state.user,
                ...payload
            }
        }
    }else{
        return state
    }
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
export const connect = (selector) => (Component) =>{  //柯里化
    return (props)=>{  //接受一个组件，返回一个组件
        const {state,setState} = useContext(appContext)
        const[,update] = useState({})
        const data =selector ? selector(state) :{state:state}  //如果传了state就是局部的state,没传就是全局的state
        //订阅store
        useEffect(()=>
            //useEffect有return的话，会在组件销毁之前执行；如果有多次渲染，就会在执行下一个effect之前，上一个effect被清除的时候执行return的函数
           store.subscribe(()=>{   //第一次执行时，会订阅store(就是传一个回调函数给store先存起来),当数据变化后，会先触发dispatch改变数据，然后再执行这个回调函数
                const newData = selector? selector(store.state) :{state:store.state}
                if(changed(data,newData)){
                    console.log("changed")
                    update({})
                }
            })
        ,[selector]) //如果不取消订阅，当加上state依赖时，会造成重复渲染，比如当二儿子改变两次时，大儿子和二儿子都会渲染两遍，因为每次state变化时，重复订阅了大儿子和二儿子，store.lisenters数组被push了多余的重复回调函数

        const dispatch =(action)=>{
            setState(reducer(state,action))
        }
        return <Component {...data} {...props} dispatch={dispatch} /> //返回的组件中又引入了子组件，子组件的props是包裹子组件的组件透传过来的
    }
}