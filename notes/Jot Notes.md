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
