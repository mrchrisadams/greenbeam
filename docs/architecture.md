## How this works

- `background` adds the UI button to call up the graph, and opens the view when it's clicked
- `lightbeam` handles the UI the lightbeam itself: the buttons, and tells viz to redraw the node list, and adds the redraw callback when data changes in the store
- `store` sets up the main db and state. Because we might have more than one browser tab open, or and more than one window open and interacting with the database, we don't call this directly. Instead rely on storechild…
- `storechild` - Store child works to delegate calls from all the open tabs to the one store running as a content script. Becuase we're only changing state in one place.
- `capture` listens for network reqs, and adds them to the db, after checking against the API
- `viz` contains the logic for showing the nodes
