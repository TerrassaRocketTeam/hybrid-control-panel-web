
export default function calculateUID (uid, label) {
  if (uid) {
    return uid
  }
  return label.replace(' ', '__')
}
