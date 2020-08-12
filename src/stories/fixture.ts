import uuidv4 from 'uuid/v4'
export const blogDetail = {
  id: 'blalalalala',
  content: 'Vim is an awesome editor and you can find the Vim simlulator in lots of popular editors(such as Intellij Idea, Atom, Sublime Text). it will make your life more easy if you familiar with the common Vim commands. \n\n ~~~javascript \n console.log(111) \n ~~~\n',
  lastModified: 0,
  createdAt: 0,
  title: 'Untitled'
}

export const randomBlogContext = () => ('# Hello World \n' + uuidv4() + '-' + blogDetail.content)
