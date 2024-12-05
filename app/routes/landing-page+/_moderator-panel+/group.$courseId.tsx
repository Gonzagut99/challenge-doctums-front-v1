import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dices, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { moderatorService } from "~/services/http/moderator";


export const loader = async ({ params }: LoaderFunctionArgs) => {
    const courses = (await moderatorService.getModerator()).courses;
    const courseId = params.courseId;
    const course = courses.find((course) => course.id === courseId);
    return course;
};

export default function CourseDetail() {
    const course = useLoaderData <typeof loader>();
    return (
        <div className="min-h-dvh w-full max-w-screen-lg mx-auto">
            <div className="flex gap-4 w-screen-lg min-w-screen-lg pb-8 pt-24 px-4 ">
                <article className="max-w-screen-lg w-full flex justify-between items-center w-4/3">
                    <section className="w-full space-y-4">
                        <header className="flex justify-between">
                            <h2 className="text-2xl font-bold">
                                {course.name}
                            </h2>
                            <Button
                                    className="w-fit bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold !mt-0"
                                >
                                    <Dices></Dices>
                                    <span>Crear partida</span>
                                </Button>
                        </header>
                        <div className="p-6 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10 w-full bg-zinc-50">
                            <CardHeader className="p-0 flex-row justify-between">
                                <CardTitle className="w-fit text-lg font-bold">
                                    Participantes
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Input placeholder="Buscar">
                                    </Input>
                                    <Button>
                                        Enviar
                                    </Button>
                                </div>
                            </CardHeader>
                            <div>
                                <Table>
                                    <TableCaption>Estudiantes</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombres / Apellidos</TableHead>
                                            <TableHead>Correo</TableHead>
                                            <TableHead>Curso</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            course.participants.map((participant) => (
                                                <TableRow key={participant.id}>
                                                    <TableCell className="flex space-x-2 items-center">
                                                        <Avatar>
                                                            <AvatarImage src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQX2Wzfc97ySx9aPuOnblFt5xsXkHjS4t1D42zrKGIERaAL2t64IB_FXi7kiyahEqeOdaCtRV2uDUckiDQx2zR9_9px8D8fk6v0ph8GRA"></AvatarImage>
                                                            <AvatarFallback>{ participant.name[0] } { participant.lastname[0] }</AvatarFallback>
                                                        </Avatar>
                                                        <div className="h-fit">{participant.name} {participant.lastname}</div>
                                                    </TableCell>
                                                    <TableCell>{participant.email}</TableCell>
                                                    <TableCell>{course.name}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </section>
                </article>
                <aside className="w-1/4">
                    <section className="p-4 rounded-2xl border-none shadow-2xl shadow-zinc-900/10 w-full bg-zinc-50 flex space-x-2">
                        <div className="aspect-square bg-celeste text-zinc-50 rounded-xl w-10 flex items-center justify-center h-10">
                            <UsersRound></UsersRound>
                        </div>
                        <div className="flex flex-col justify-start">
                            <h3 className="text-lg font-bold text-end">
                                Estudiantes
                            </h3>
                            <p className="text-xl text-end">
                                {
                                    course.participants.length
                                }
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
