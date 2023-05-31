import { useForm, useFieldArray} from "react-hook-form";
import {DevTool} from "@hookform/devtools";
 

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
      }
    });
    //console.log(form);
    const {register,control,handleSubmit,formState} = form;
    const {errors} = formState;
    //invoke field as an array of fields
    const {fields,append,remove}= useFieldArray({name:"phNumbers",control});

    //const { onChange, onBlur, name, ref } = register("username");

    const onSubmit = (data:FormValues) => {
      console.log("Form submitted",data);
    }

   renderCount++;

    return (
      <div>
        <h1>Employee Form({renderCount/2})</h1>
  
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <div form-control>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" {...register("username",{
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
            <input type="text" id="twitter" {...register("social.twitter")} />
          </div>

          <div form-control>
            <label htmlFor="twitter">Linkedin</label>
            <input type="text" id="linkedin" {...register("social.twitter")} />
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
  
          <button>Submit</button>
        </form>
        <DevTool control={control}/>
      </div>
    );
  };
  export default Form;