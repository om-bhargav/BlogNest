import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
export default function SubmitButton({children,disabled=false,...props}:React.ComponentProps<typeof Button>) {
  const {pending} = useFormStatus();
  return (
    <Button {...props} disabled={disabled || pending}>{pending ? <Loader2 className='animate-spin' size={20}/>:children}</Button>
  )
}
