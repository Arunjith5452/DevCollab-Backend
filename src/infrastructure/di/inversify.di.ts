import "reflect-metadata";
import { Container } from 'inversify'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user'
import { AdminModule } from './modules/admin/admin.module'
import { ProjectModule } from './modules/project/project.module'
import { TaskModule } from './modules/tasks/tasks.module'
import { PaymentModule } from "./modules/payment/payment.module";
import { MeetingModule } from "./modules/meetings/meetings.module";
import { CommonModule } from "./modules/common/common.module";
import { subscriptionModule } from "./modules/subscription/subscription.module";
import { planModule } from "./modules/plan/plan.module";

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
    MeetingModule,
    CommonModule,
    subscriptionModule,
    planModule
);


export { container }