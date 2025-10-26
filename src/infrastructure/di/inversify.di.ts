import { Container } from 'inversify'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'
import { AdminModule } from './modules/admin'

const container = new Container({
    defaultScope:"Singleton",
    autobind:true
})

container.load(
    AuthModule,
    UserModule,
    AdminModule
)


export {container}