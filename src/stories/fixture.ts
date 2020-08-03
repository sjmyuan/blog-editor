import axios from 'axios'
import uuidv4 from 'uuid/v4'
import {ServerApi, TagNoteMapping, NoteId, TagId, NoteContext, NoteDetail, TagDetail, MemoryAppContext} from '../types'
export const tagDetail = {id: 'functional-programming', content: 'Functional Programming', lastModified: 0};
export const tagArray = [
  {id: 'id1', content: 'Scala', lastModified: 0},
  {id: 'id2', content: 'Ruby', lastModified: 0},
  {id: 'id3', content: 'Kotlin', lastModified: 0},
  {id: 'id4', content: 'Java', lastModified: 0},
  {id: 'id5', content: 'C++', lastModified: 0},
  {id: 'id6', content: 'Python', lastModified: 0},
  {id: 'id7', content: 'Perl', lastModified: 0},
]
export const noteDetail = {
  id: 'blalalalala',
  content: 'Vim is an awesome editor and you can find the Vim simlulator in lots of popular editors(such as Intellij Idea, Atom, Sublime Text). it will make your life more easy if you familiar with the common Vim commands. \n\n ~~~javascript \n console.log(111) \n ~~~\n',
  lastModified: 0
}

export const noteContext = {
  note: noteDetail,
  tags: tagArray
}

export const randomNoteContext = () => ({
  note: {...noteDetail, id: uuidv4(), content: '# Hello World \n' + uuidv4() + '-' + noteDetail.content},
  tags: tagArray
})

export const MockServerApi: (host: string) => ServerApi = (host: string) => ({
  getMapping: async () => {
    return (await axios.get(`${host}/mapping`)).data
  },
  saveMapping: async (mapping: TagNoteMapping[]) => {
    await axios.post(`${host}/mapping`, mapping)
  },
  getAllTags: async () => {
    return (await axios.get(`${host}/tags`)).data
  },
  saveAllTags: async (allTags: TagDetail[]) => {
    await axios.post(`${host}/tags`, allTags)
  },

  getNote: async (id: NoteId) => {
    return (await axios.get(`${host}/note/${id}`)).data
  },
  saveNote: async (note: NoteDetail) => {
    await axios.post(`${host}/note`, note)
  },
  deleteNote: async (id: NoteId) => {
    await axios.delete(`${host}/note/${id}`)
  },
  getPresignedUrl: async (key: string) => {
    return key
  },
  saveFile: async (key: string, content: File) => {}
})

export const mockMemoryAppContext: MemoryAppContext = {
  info: {
    allTags: tagArray,
    mapping: tagArray.map((e, index) => ({id: index.toString(), tagId: e.id, noteId: noteDetail.id}))
  },
  actions: {
    loadContext: async () => {},
    getTag: (id: TagId) => tagArray.find(e => e.id == id),
    getNote: async (id: NoteId) => noteDetail,
    defaultTag: noteDetail,
    getRelatedNoteContexts: async (id: TagId) => [randomNoteContext()],
    deleteNote: async (id: NoteId) => {},
    deleteNoteFromTag: async (noteId: NoteId, tagId: TagId) => {},
    addNote: async (note: NoteContext) => {},
    moveNoteTo: async (notes: NoteId[], toTag: TagId, fromTag?: TagId) => {},
    mergeNotes: async (tag: TagId, notes: NoteContext[]) => {},
    addTag: async (tag: TagDetail) => {},
    updateTag: async (tag: TagDetail) => {},
    deleteTag: async (id: TagId) => {},
    getUrl: async (key: string) => `signedurl/${key}`,
    saveFile: async (key: string, content: File) => {}
  }
}


