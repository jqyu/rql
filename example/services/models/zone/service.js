import { Schema, Service } from '../../../../radredis'
import source from '../../sources/radredis'

const schema = Schema('services/models/zone/type')
const service = Service(schema, source)

export const find     = service.find

export const findMany = service.findMany

export const all      = service.all

export const create   = service.create

export const update   = service.update

export const destroy  = service.delete
