import React,{useState,useContext,useMemo} from 'react';

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

const User = () =>{
    console.log('user执行了' + Math.random())
    const {state} = useContext(appContext)
    return(<div>{state.user.name}</div>)
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
    return (props)=>{
        const {state,setState} = useContext(appContext)
        const[,update] = useState({})
        const dispatch =(action)=>{
            setState(reducer(state,action))
            update({}) //当调用store的setState的时候，触发强制更新
        }
        return <Component {...props} dispatch={dispatch} state={state}/>
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


export default App;
