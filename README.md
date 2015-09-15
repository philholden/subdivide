# Subdivide Layout

A web application shell for displaying components in panes which can be:

* infinitively subdivided
* subdivided horizontally or vertically
* subdivided by dragging corners
* resized by dragging edges
* merged by dragging corners onto adjacent panes 

When a new pane is created the user can chose which component to display in that pane. The result is an application where the user can decide on an interface that suits their work flow.

It should also be possible to quickly mash up applications out of preexisting parts.

----

## Credits

Subdivide was inspired by [Blender's](http://blender.orgs) subdividable UI. I have wanted to implement this on the web for ages. Final kick to get it done was seeing [this discussion](https://github.com/gaearon/redux-devtools/issues/41#issuecomment-129898889) on the `redux-devtools` repo.

Subdivde uses [redux](https://github.com/rackt/redux) to manage state thanks to @gaearon for the great library, talks and docs.

Work bagan in a hackathon at [NCR Edinburgh](http://ncredinburgh.com). A big thanks to them for allowing me to open source it so I can continue to work on it in my own time.


