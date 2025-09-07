# This is the project I created to store my school notes

This app will use the stack bun, react, css, postgres

## Current Schema of database

- Table: Topics
  - Columns:
    - topic_id PRIMARY KEY
    - parent_topic_id integer
    - topic_name TEXT
    - topic_notes TEXT
  - Constraints:
    - PRIMARY KEY topic_id
    - FOREGIN KEY parent_topic_id REFERENCES Topics (topic_id)

## Back-end Routes

### GET Routes

- /api/topics -> Select all the topics
- /api/topics/:id -> Select a particular topic
- /api/topics/:parentId/subTopics -> Select all the sub-topics for a topic

### POST Routes

- /api/topics -> Add a new topic
  - Body: parentId / topicName / topicNotes

### PUT Routes

- /api/topics/:id -> Update a topic name and/or notes
  - Body: parentId / topicName / topicNotes

### DELETE Routes

- /api/topics -> Delete all the topics
- /api/topics/:id -> Delete a topic
- /api/topics/:id/subTopics -> Delete all sub-topics of a topic
