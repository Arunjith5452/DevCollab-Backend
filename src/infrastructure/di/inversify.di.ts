import "reflect-metadata";
import { Container } from 'inversify'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'
import { AdminModule } from './modules/admin'
import { ProjectModule } from './modules/project'
import { TaskModule } from './modules/tasks'
import { PaymentModule } from "./modules/payment/payment";
import { MeetingModule } from "./modules/meetings";

const container = new Container({
    defaultScope: "Singleton",
    autobind: true
})

container.load(
    UserModule,
    AuthModule,
    AdminModule,
    ProjectModule,
    TaskModule,
    PaymentModule,
    MeetingModule
);


export { container }