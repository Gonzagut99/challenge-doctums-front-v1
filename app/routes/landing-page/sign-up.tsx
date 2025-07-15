import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const schema = z.object({
    name: z.string().min(2),
    lastname: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);
export default function SignUp() {
    const form = useRemixForm<FormData>({
        resolver,
    });
  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
        <Card className="min-w-[480px] max-w-[480px] w-fit p-12 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10">
            <CardHeader className="p-0">
                <CardTitle className="text-3xl font-medium leading-snug">Bienvenido al Challenge Doctums</CardTitle>
                <CardDescription className="text-xl">Registrate</CardDescription>
            </CardHeader>
            <RemixFormProvider {...form}>
                <Form onSubmit={form.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Nombres
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}  placeholder="Ingresa tu nombre" className="placeholder:opacity-50"/>
                                        </FormControl>
                                        {/* <FormDescription></FormDescription> */}
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )
                            }
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Apellidos
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}  placeholder="Ingresa tu apellido" className="placeholder:opacity-50"/>
                                        </FormControl>
                                        {/* <FormDescription></FormDescription> */}
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )
                            }
                        >
                        </FormField>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
Correo electrónico                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}  placeholder="Ingresa tu correo" className="placeholder:opacity-50"/>
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )
                        }
                    >

                    </FormField>
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password"  placeholder="Ingresa tu contraseña" className="placeholder:opacity-50"/>
                                        </FormControl>
                                        {/* <FormDescription></FormDescription> */}
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )
                            }
                        >
                        </FormField>
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Confirmar contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field}  placeholder="Confirma tu contraseña" className="placeholder:opacity-50"/>
                                        </FormControl>
                                        {/* <FormDescription></FormDescription> */}
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )
                            }
                        >
                        </FormField>
                    </div>
                    <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        
                                        <div className="space-x-2">
                                        <FormControl>
                                            <Checkbox {...field} className="placeholder:opacity-50"/>
                                        </FormControl>
                                        <FormLabel className="text-sm">
                                            Estoy de acuerdo con los terminos y políticas
                                        </FormLabel>
                                        </div>
                                        {/* <FormDescription></FormDescription> */}
                                        <FormMessage></FormMessage>
                                        
                                    </FormItem>
                                )
                            }
                        >
                        </FormField>
                        <Button className="w-full bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold text-lg !mt-6" type="submit">
                                            Registrar
                                        </Button>
                </Form>
            </RemixFormProvider>
        </Card>
    </div>
  )
}