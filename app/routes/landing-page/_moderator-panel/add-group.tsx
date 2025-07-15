import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const schema = z.object({
    name: z.string().min(5),
    participants: z.coerce.number().min(1),
    gameHallls: z.number().min(1),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);
export default function AddGroup() {
    const form = useRemixForm<FormData>({
        resolver,
    });
  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
        <Card className="min-w-[480px] max-w-[480px] w-fit p-12 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10">
            <CardHeader className="p-0">
                <CardTitle className="text-3xl font-medium leading-snug">Agregar nuevo grupo</CardTitle>
                <CardDescription className="text-md">Llena la información requerida</CardDescription>
            </CardHeader>
            <RemixFormProvider {...form}>
                <Form onSubmit={form.handleSubmit} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Nombre de grupo
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}  placeholder="Ingresa el nombre del curso que das" className="placeholder:opacity-50"/>
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
                        name="participants"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Número de participantes
                                    </FormLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                    <FormControl>
                                        <Input {...field} className="placeholder:opacity-50"/>
                                    </FormControl>
                                    <Button>
                                        Generar Código
                                    </Button>
                                    </div>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )
                        }
                    >

                    </FormField>
                    <FormField
                        control={form.control}
                        name="gameHallls"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Número de salas de juego
                                    </FormLabel>
                                    <FormDescription>
                                        Ingresa manualmente el número de salas de juego para tus estudiantes o generalas automáticamente después de ingresar el número de participantes.
                                    </FormDescription>
                                    <div className="grid grid-cols-2 gap-2">
                                    <FormControl>
                                        <Input {...field} className="placeholder:opacity-50"/>
                                    </FormControl>
                                    <Button>
                                        Generar Automáticamente
                                    </Button>
                                    </div>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )
                        }
                    >

                    </FormField>
                        <Button className="w-full bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold text-lg !mt-6" type="submit">
                            Ingresar
                        </Button>
                </Form>
            </RemixFormProvider>
        </Card>
    </div>
  )
}