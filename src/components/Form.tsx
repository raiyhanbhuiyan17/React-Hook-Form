import { useEffect } from "react";
import { useForm, useFieldArray, FieldErrors} from "react-hook-form";
import {DevTool} from "@hookform/devtools";
import { channel } from "diagnostics_channel";

 

let renderCount = 0;
//defining the types-typescript
type FormValues={
  username: string;
  email: string;
  channel: string;
  social: {
    linkedin: string;
    twitter: string;
  };
  phoneNumbers: string[];
  //phNumbers: this is going to be array of objects ;not array of strings
  phNumbers:{
    number: string;
  }[];
  age: number;
  dob: Date;
}

 const Form = () => {
    const form = useForm<FormValues>({
      // setting up default values from api or userend
      defaultValues:{
          username: "Admin",
          email: "admin@example.com",
          channel: "React-Hook-Form",
          social:{
            linkedin:"",
            twitter:"",
          },
          phoneNumbers:["",""],

          //to create - dynamic fileds; here, bydefault we've one object which is number
          phNumbers: [{number: ""}],
          //we need to specify this phNumbers field as an array of fileds.for that we invoke useFieldArray Hook

          age : 0,
          dob: new Date(),
      },
      mode:"onTouched", //onTouched: instant error popup; onBlur: blur a field; onChange: if any change is made it continuously starts validating, using this one is tricky this could impact on performance, every time is re-render.; all: do both onBlur & onChange
      
    });
    //console.log(form);
    const {register,control,handleSubmit,formState, watch,getValues,setValue,reset,trigger} = form;
    const {errors,dirtyFields,touchedFields,isDirty,isValid,isSubmitting,isSubmitted,isSubmitSuccessful,submitCount} = formState;
    console.log(isSubmitting,isSubmitted,isSubmitSuccessful,submitCount);
    //dirty: if data in the field is modified||touched: if the field is touched or checked but no changes are made || isDirty:if data in the field is modified; say ture or false.
    console.log(dirtyFields,touchedFields,isDirty,isValid);
    //invoke field as an array of fields
    const {fields,append,remove}= useFieldArray({name:"phNumbers",control});

    //const { onChange, onBlur, name, ref } = register("username");

    //const watchedValue = watch("username");
    // const watchedValue = watch(["username","email"]);
    // const watchForm = watch();

    const onSubmit = (data:FormValues) => {
      console.log("Form submitted",data);
    }

    const handleGetValues = () => {
      console.log("GetValues:", getValues(["username","channel"]));
    };
    //For validation we have to send as object
    const handleSetValues = () => {
      console.log("SetValues:", setValue("username","",{shouldValidate:true,shouldDirty:true,shouldTouch:true}));
    };

    //reset the form values
    // const handleReset = () => {
    //   reset()
    // };

    //reset using useEffect hook
    useEffect(() => {
      if(isSubmitSuccessful){
        reset();
      }
    },[isSubmitSuccessful,reset]);

    // useEffect(()=>{
    //   const subscription = watch((value)=> 
    //     console.log(value));

    //   return ()=>subscription.unsubscribe();
    // },[watch]);

    //showing error message by importing "FieldErrors" from react hook form. 
    const onError =(errors:FieldErrors<FormValues>) => {
      console.log("OnError:", errors);
    }

   renderCount++;

    return (
      <div>
        <h1>Employee Form({renderCount/2})</h1>
        {/* <h2>Watched Value:{JSON.stringify(watchForm)}</h2> */}
  
        <form onSubmit={handleSubmit(onSubmit,onError)} noValidate>

          <div form-control>
            <label htmlFor="username">Username</label>
            {/* making username disabled by default. by using the keyword: disabled */}
            <input type="text" disabled id="username" {...register("username",{
            required:{
              value:true,
              message:"Username is required"}
          })}/>
          {/* to show error message */}
          <p className="error">{errors.username?.message}</p>
          </div>
          
          <div form-control>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...register("email",{
            pattern:{
              value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid email format",
            },
            validate:{
              // multiple key using for customize validation: notAdmin, notBlackListed
              notAdmin:(fieldValue)=>{
                return(fieldValue!=="admin@example.com" || "Enter a different email address")
              },
              notBlackListed:(fieldValue)=>{
                return !fieldValue.endsWith("baddomain.com") || "This domain is not supported!"
              },
              emailAvailability: async(fieldValue)=>{
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length == 0 || "Email is already exists."
              },
            }
            })} />
          <p className="error">{errors.email?.message}</p>
          </div>
          
          <div form-control>
            <label htmlFor="channel">Channel</label>
            <input type="text" id="channel" {...register("channel",{
            required:{
              value:true,
              message:"A Channel name is required"
          }})} />
          <p className="error">{errors.channel?.message}</p>
          </div>

          <div form-control>
            <label htmlFor="twitter">Twitter</label>
            {/* using disabled method inside the register method */}
            <input 
            type="text" 
            id="twitter" {...register("social.twitter",{
             disabled:true, 
             required:"Enter a Twitter Account"
            })} />
          </div>

          <div form-control>
            <label htmlFor="linkedin">Linkedin</label>
            <input type="text" 
            id="linkedin" {...register("social.linkedin",{
              // using conditional disabled functionality
              disabled:watch("channel")==="",
              required:"Enter a linked account"
            })} />
          </div>
          {/* . [dot] notation(phoneNumbers.0) is used for consistency in typescript we can't use bracket notation for this index phoneNumbers[0] */}
          <div className='form-control'>
            <label htmlFor="primary-phone">Primary Phone</label>
            <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
          </div>

          <div className='form-control'>
            <label htmlFor="secondary-phone">Secondary Phone</label>
            <input type="text" id="secondary-phone" {...register("phoneNumbers.1")} />
          </div>

          {/* dynamic fields: where user can add multiple phone numbers and can remove */}
          <div >
            <label>List of Phone Numbers</label>
            <div>
              {fields.map((field,index) =>{
                return (<div className="form-control" key={field.id}>
                  <input 
                  type="text" 
                  {...register(`phNumbers.${index}.number` as const)}
                  />
                  
                  {/* below condition is to check atleast one phone number; can't allow user to all the phone numbers */}
                  {index>0 && (<button type="button" onClick={()=>remove(index)}>Remove Phone Number</button>)}
                  
                </div>);
              })}
              {/* this-> append({number:""}) will add a new entry into our array -> phNumbers: [{number: ""}]  */}
              <button type='button' onClick={()=>append({number:""})}>Add Phone Number</button>

            </div>

          </div>

          <div form-control>
            <label htmlFor="age">Age</label>
            <input type="number" id="age" {...register("age",{
            //valueAsNumber convert string to number; this is an option in the register form.
            valueAsNumber: true,
            required:{
              value:true,
              message:"Age is required"
          }})} />
          <p className="error">{errors.age?.message}</p>
          </div>

          <div form-control>
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" {...register("dob",{
            //valueAsDate: true,
            required:{
              value:true,
              message:"Date of Birth is required"
          }})} />
          <p className="error">{errors.dob?.message}</p>
          </div>
          
          {/* disable submit button by cheking the condition wheteher is modified or valid */}
          {/* deleting !isValid due to check the api given email as api usually doesn't follow email rules sometimes */}
          <button disabled={!isDirty|| isSubmitting} >Submit</button>
        
          <button type="button" onClick={handleGetValues}>GetValues</button>
          <button type="button" onClick={handleSetValues}>SetValues</button>
          
          {/* reset usning button  */}
          {/* <button type="button" onClick={()=>reset()}>Reset</button> */}
           
           {/* this trigger all the fields. */}
           {/* <button type="button" onClick={()=>trigger()}>Validate</button> */}

           {/* this trigger only the parameter we've passed */}
           <button type="button" onClick={()=>trigger("channel")}>Validate</button>

          
        </form>
        <DevTool control={control}/>
      </div>
    );
  };
  export default Form;