# Jot Notes

---

## Form Handling

If you have a series of input items which will be sending a request to a backend, you can do a neat trick to prevent the user from modifying the data before the request has resolved. If you wrap eht inputs in a `<fieldset>` they will operate the same as usual. Then, whilst your request is firing, use your `loading` flag as a boolean attribute:

```js
<form>
  <fieldset disabled={loading} aria-busy={loading}>
    // rest of component's inputs
  </fieldset>
</form>
```

The entire form will be greyed out while awaiting the response, and you can even style it differently using the `aria-busy` accessibility label:

```css
&[aria-busy='true'] {
  /* blah blah blah */
}
```

---

## Image Handling

In some situations, it might be easier to have a dedicated service to store your images so that they load faster, and can be easily manipulated when saved to disk. One of the more popular services for such a thing is known as Cloudinary which was used for building out this application, but the flow, (even if done locally, is largely the same).

When the user uploads an image through their browser, you're going to hit up the endpoint, with whatever parameters you need, and `await` the response containing the CDN link to the image. Then store that in your state and go about the rest of your application's processes (i.e. saving to a database, creating an item, etc). You may wonder why this is done whenever the `<input type="file" />` is changed and it really doesn't need to be. You can do this just before submit so that you don't save excess to your database. I like this way because you can do things like revert to previously uploaded photos and display a preview super fast.

The following shows how to set-up with Cloudinary, given you have set up an account with an `upload_preset` (used for manipulation on upload):

```js
uploadFile = async e => {
    const [file] = e.target.files // Take only the first file
    const data = new FormData()
    data.append('file', file)
    // Select the correct Cloudinary upload-preset configuration
    data.append('upload_preset', 'sick-fits') //sick-fits is specific to this application
    await this.setState({ uploading: true })
    const res = await fetch(imageEndpoint, {
      method: 'POST',
      body: data
    })
    const upload = await res.json()
    this.setState({
      image: upload.secure_url,
      uploading: false
    })
```

The `imageEndpoint` depends on the provider you use, but for the most part, appending data to the body the request, and using the built in `fetch`, and `FormData` APIs, is the way to go.

---
