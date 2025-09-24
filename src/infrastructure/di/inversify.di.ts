import { Container } from 'inversify'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'

const conatiner = new Container({
    defaultScope:"Singleton",
    autobind:true
})

conatiner.load(
    AuthModule,
    UserModule
)


export {conatiner}