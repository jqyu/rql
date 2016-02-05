import Radredis from '../../src/sources/Radredis'
import config from '../config/environment'

const maxredis = Radredis(config.redis)

export default maxredis
