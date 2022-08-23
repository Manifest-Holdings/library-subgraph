import { BigInt, store } from "@graphprotocol/graph-ts"
import {
  Library,
  Record,
  Revoke
} from "../generated/Library/Library"
import { Tag, Book, Author } from "../generated/schema"

export function handleRecord(event: Record): void {

  let author = Author.load(event.params.author + '-' + event.params.authorWallet.toHexString())
  if (!author) {
    author = new Author(event.params.author + '-' + event.params.authorWallet.toHexString())
    author.name = event.params.author
    author.wallet = event.params.authorWallet
    author.bookCount = BigInt.fromI32(1)
    author.save()
  } else {
    author.bookCount = author.bookCount.plus(BigInt.fromI32(1))
    author.save()
  }

  const tagIds: Array<string> = []
  for(let i=0; i < event.params.tags.length; i++) {
    let tag = new Tag(event.transaction.hash.toHexString() + '-' + event.params.tags[i].key)
    tag.key = event.params.tags[i].key
    tag.value = event.params.tags[i].value
    tag.save()
    tagIds.push(tag.id)
  }

  let book = new Book(event.transaction.hash.toHexString())
  book.title = event.params.title
  book.author = author.id
  book.content = event.params.content
  book.timestamp = event.block.timestamp
  book.tags = tagIds
  book.save()

}

export function handleRevoke(event: Revoke): void {

  let book = Book.load(event.params.id.toHexString())
  if (book) {

    let author = Author.load(book.author)
    if (author) {
      if (author.bookCount <= BigInt.fromI32(1)) {
        store.remove('Author', author.id)
      } else {
        author.bookCount = author.bookCount.minus(BigInt.fromI32(1))
        author.save()
      }
    }
    for(let i=0; i < book.tags.length; i++) {
      let tag = Tag.load(book.tags[i])
      if (tag) {
        store.remove('Tag', tag.id)
      }
    }
    store.remove("Book", book.id)
  }
}
