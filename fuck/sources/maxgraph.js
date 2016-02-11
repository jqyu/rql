import Radgraph from '../../src/sources/Radgraph'
import config from '../config/environment'

const maxgraph = Radgraph(config.redis)

export default maxgraph
