import "reflect-metadata";
import { Container } from 'inversify'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'
import { AdminModule } from './modules/admin'
import { ProjectModule } from './modules/project'
import { TaskModule } from './modules/tasks'

const container = new Container({
    defaultScope:"Singleton",
    autobind:true
})

container.load(
    UserModule,    
    AuthModule,      
    AdminModule,    
    ProjectModule,
    TaskModule
);


export {container}