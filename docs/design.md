# Working design doc

## Entity format (JSON)

```json
{
  "id": "mac210622",
  "name": "My Awesome Conf 2021",
  "owner": "<GH username>",
  "startDate": "2021-06-22T00:00:00Z",
  "endDate": "2021-06-22T00:00:00Z",
  "passes": {
    "123456": "hash"
  },
  "locked": false,
  "archived": false,
  "deleted": false
}
```

Possible states:

- open (= not locked and not archived)
- locked
- archived (implies locked)
- deleted (currently unused, but may be used in the future)

## Admin: create new event form

Enter event name:
[ ]

Event start date (in your local timezone):
[ ]

Event end date (in your local timezone):
Note: event will become locked 48h after its end date.
[ ]

Azure Passes (1 by line):
[ ]
[ ]
[ ]
[ ]

                             ( Cancel ) ( Create )

## Admin: roles

Roles are managed in the `/api/administrators.json` file.
It's a map of `GitHub username` to `role`:

- `superadmin`: can see and edit all events
- `admin`: can see and edit only events where the owner is the same as the username

## Maintenance jobs

- `api/autolock`: locks events that have ended 48h after their end date
- `api/autoarchive`: archives events that have ended 30 days after their end date

## API structure

| Path                                  | Access      | Descriptions                                                   |
| ------------------------------------- | ----------- | -------------------------------------------------------------- |
| GET /api/me                           | anon, auth  | Returns the current user's credentials, null if not logged in. |
| GET /api/events[?showArchived=true]   | admin       | Gets all events.                                               |
| GET /api/events/:id[?withPasses=true] | anon, admin | Gets an event by id. Needs admin to get passes.                |
| POST /api/events                      | admin       | Creates an event.                                              |
| PATCH /api/events/:id                 | admin       | Updates an event.                                              |
| GET /api/events/:id/pass              | auth        | Gets an Azure pass for an event.                               |
| PUT /api/events/:id/passes/:code      | admin       | Updates an Azure pass assignation.                             |
