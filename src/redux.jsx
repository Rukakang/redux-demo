import React,{useState,useContext,useEffect} from 'react';

export const appContext = React.createContext(null);

export const store = {
    state:{
        user:{
            name:'bobojier',
            age:18
        }
    },
    setState(newState){   //store的setState不是hooks的setState
        store.state = newState
        store.linsterners.map(fn=>fn(store.state)) //setState的时候，订阅了store变化的监听者都进行函数回调
    },
    linsterners:[],
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

export const connect = (selector) => (Component) =>{  //柯里化
    return (props)=>{  //接受一个组件，返回一个组件
        const {state,setState} = useContext(appContext)
        const[,update] = useState({})
        const data =selector ? selector(state) :{state:state}  //如果传了state就是局部的state,没传就是全局的state
        //订阅store
        useEffect(()=>{
            store.subscribe(()=>{
                update({})
            })
        },[])

        const dispatch =(action)=>{
            setState(reducer(state,action))
        }
        return <Component {...data} {...props} dispatch={dispatch} /> //返回的组件中又引入了子组件，子组件的props是包裹子组件的组件透传过来的
    }
}