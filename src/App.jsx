import React,{useState,useContext,useMemo,useEffect} from 'react';

const appContext = React.createContext(null);
const store = {
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

const App =() => {
    //const [appState,setAppState] = useState({user:{name:'bobojier',age:18}})
   // const contextValue ={appState,setAppState}
    return(
        <appContext.Provider value={store}>
            <BigSon/>
            <SecondSon/>
            <SmallSon/>
        </appContext.Provider>
    )
}
//()=>xxx  句式会自动return  ()=>{}句式需要在花括号里写return
const BigSon = () => {
    console.log('大儿子执行了' + Math.random())
   return <section>大儿子<User/></section>
}
const SecondSon = () => {
    console.log('二儿子执行了' + Math.random())
    return <section>二儿子<UserModifier x={'d'}>hhh</UserModifier></section>
}

const SmallSon = () => {
    console.log('小儿子执行了' + Math.random())
    return <section>小儿子</section>
}


const reducer = (state,{type,payload})=>{
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

const connect = (Component) =>{
    return (props)=>{  //接受一个组件，返回一个组件
        const {state,setState} = useContext(appContext)
        const[,update] = useState({})

        //订阅store
        useEffect(()=>{
            store.subscribe(()=>{
                update({})
            })
        },[])

        const dispatch =(action)=>{
            setState(reducer(state,action))
        }
        return <Component {...props} dispatch={dispatch} state={state}/> //返回的组件中又引入了子组件，子组件的props是包裹子组件的组件透传过来的
    }
}

const UserModifier = connect(({dispatch,state,children}) => {  //解构赋值，此时的pros为:{x:'d',children:'hhh',dispatch:(action)=>{},state:{user:{name:'bobojier',age:18}}}
    console.log('userModifier执行了' + Math.random())
    const onChange = (e) =>{
        dispatch({type:"updateState",payload:{name:e.target.value}})
    }
    return(
        <input value={state.user.name} onChange={onChange}/>
    )
})
const User =connect(
    ({state}) =>{
        console.log('user执行了' + Math.random())
        return(<div>{state.user.name}</div>)
    }
)

export default App;
