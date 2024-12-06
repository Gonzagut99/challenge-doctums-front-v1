type Moderator = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    courses: {
        id: string;
        name: string;
        description: string;
        participants: CourseParticipant[];
        icon: string;
        createdAt: string;
        updatedAt: string;
    }[];
};

type CourseParticipant = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    courseId: string;
    createdAt: string;
    updatedAt: string;
};

const moderator1 = {
    id: "1",
    name: "Marco Antonio",
    lastname: "Solis",
    email: "maSolis@example.com",
    role: "moderator",
    createdAt: "2022-02-02",
    updatedAt: "2022-02-02",
    courses: [
        {
            id: "1",
            name: "Curso de Matemáticas",
            description: "Aprende matemáticas de forma rápida y sencilla",
            participants: [
                {
                    id: "1",
                    name: "Pedro",
                    email: "pedroexample.com",
                    lastname: "Gómez",
                    role: "student",
                    courseId: "1",
                    createdAt: "2022-02-02",
                    updatedAt: "2022-02-02",
                },
                {
                    id: "2",
                    name: "María",
                    email: "maria@example.com",
                    lastname: "García",
                    role: "student",
                    courseId: "1",
                    createdAt: "2022-02-02",
                    updatedAt: "2022-02-02",
                },
            ],
            icon: "/assets/landing/icons/CourseCardSymbol1.png",
            createdAt: "2022-02-02",
            updatedAt: "2022-02-02",
        },
        {
            id: "2",
            name: "Curso de Historia",
            description: "Aprende historia de forma rápida y sencilla",
            participants: [
                {
                    id: "3",
                    name: "José",
                    lastname: "Gómez",
                    email: "jose@example.com",
                    role: "student",
                    courseId: "2",
                    createdAt: "2022-02-02",
                    updatedAt: "2022-02-02",
                },
                {
                    id: "4",
                    name: "Ana",
                    email: "ana@example.com",
                    lastname: "García",
                    role: "student",
                    courseId: "2",
                    createdAt: "2022-02-02",
                    updatedAt: "2022-02-02",
                },
            ],
            icon: "/assets/landing/icons/CourseCardSymbol2.png",
            createdAt: "2022-02-02",
            updatedAt: "2022-02-02",
        },
    ],
};

export class ModeratorService {
    async getModerator(): Promise<Moderator> {
        return moderator1;
    }
    async getModeratorById(id: string): Promise<Moderator> {
        return moderator1;
    }
}

export const moderatorService = new ModeratorService();
