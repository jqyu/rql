import { Source } from '../../../radredis/'

import config from '../../config/environment'

export default Source(config.redis)
