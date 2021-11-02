import React,{useState,useContext} from 'react';

const appContext = React.createContext(null);
const App =() => {
    const [appState,setAppState] = useState({user:{name:'bobojier',age:18}})
    const contextValue ={appState,setAppState}
    return(
        <appContext.Provider value={contextValue}>
            <BigSon/>
            <SecondSon/>
            <SmallSon/>
        </appContext.Provider>
    )
}
const BigSon = () => <section>大儿子<User/></section>
const SecondSon = () => <section>二儿子<UserModifier/></section>
const SmallSon = () => <section>小儿子</section>

const User = () =>{
    const {appState} = useContext(appContext)
    return(<div>{appState.user.name}</div>)
}
const UserModifier = () => {
    const {appState,setAppState} = useContext(appContext)
    const onChange = (e) =>{
        setAppState({...appState,user:{name:e.target.value}})
    }
    return(
        <input value={appState.user.name} onChange={onChange}/>
    )
}



export default App;
