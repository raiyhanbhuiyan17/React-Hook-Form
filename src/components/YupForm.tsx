import React from 'react';
import { useForm, useFieldArray, FieldErrors} from "react-hook-form";
import {DevTool} from "@hookform/devtools";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';


const schema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Email format is not valid").required("Email is required"),
    phone:yup.number().required("Phone number is required"),
})

type FormValues = {
    username: string,
    email: string,
    phone: number,
}

const YupForm = () => {
  
    const form = useForm<FormValues>({
        defaultValues: {
            "username": "",
            "email": "",
            phone: 0,
        },
        // this will validate the form values and poplulates the error object
        resolver:yupResolver(schema)
    });

    const {register,control,handleSubmit,formState, watch,getValues,setValue,reset,trigger} =form;
    const {errors,dirtyFields,touchedFields,isDirty,isValid,isSubmitting,isSubmitted,isSubmitSuccessful,submitCount} =formState;

    const onSubmit = ()=>{

    }

  return (
    <div>
      <div>Yup Form Validation</div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div form-control >
          <label htmlFor='username'>Username</label>
          <input type='text' id='username'{...register("username")} />
          <p className='error'>{errors.username?.message}</p>
        </div>

        <div form-control>
          <label htmlFor='email'>Email</label>
          <input type='text' id='email' {...register("email")} />
          <p className='error'>{errors.email?.message}</p>
        </div>

        <div form-control>
         <label htmlFor='phone'>Phone</label>
          <input type='number' id='phone' {...register("phone")}/>
          <p className='error'>{errors.phone?.message}</p>
        </div>

        <button>Submit</button>

      </form>
      <DevTool control={control}/>

    </div>
    
    
  )
}

export default YupForm