import { useForm } from "react-hook-form";
import {DevTool} from "@hookform/devtools";
 

let renderCount = 0;
//defining the types-typescript
type FormValues={
  username: string
  email: string
  channel: string
}

 const Form = () => {
    const form = useForm<FormValues>({
      defaultValues: {
        username: 'AlexI',
        email: '',
        channel: '',
      }
    });
    //console.log(form);
    const {register,control,handleSubmit,formState} = form;
    const {errors} = formState;

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
  
          <button>Submit</button>
        </form>
        <DevTool control={control}/>
      </div>
    );
  };
  export default Form;