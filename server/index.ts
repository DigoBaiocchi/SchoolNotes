import { sql } from "bun";

type TopicRow = [String, String | null, String, String];

type MapResults = {
    id: String;
    parentId: String;
    topicName: String;
    topicNotes: String;
}

type BodyResult = {
    parent_topic_id: String;
    topic_name: String;
    topic_notes: String;
};

Bun.serve({
    port: 3000,
    routes: {
        "/api/topics": {
            GET: async () => {
                const results = await sql`SELECT * FROM topics`.values();
                const mapResults:MapResults[] = results.map(([id, parentId, topicName, topicNotes]:TopicRow[]) => ({id, parentId, topicName, topicNotes}));
                return Response.json({ topics: mapResults, status: 200 });
            },
            POST: async req => {
                const topic = await req.json() as BodyResult;
                await sql`INSERT INTO topics (parent_topic_id, topic_name, topic_notes)
                                            VALUES (${topic.parent_topic_id}, ${topic.topic_name}, ${topic.topic_notes})`;
                return Response.json({ message: topic, status: 201 });
            },
            DELETE: async () => {
                await sql `DELETE FROM topics`;
                return Response.json({ message: "All messages were deleted" });
            }
        },
        "/api/topics/:id": {
            GET: async req => {
                const results = await sql`SELECT * FROM topics WHERE topic_id = ${req.params.id}`.values();
                if (results.length > 0) {
                    const [id, parentId, topicName, topicNotes] = [...results[0]];
                    return Response.json({
                        id,
                        parentId,
                        topicName,
                        topicNotes,
                    });
                }
                else {
                    return Response.json({ message: `Id: ${req.params.id} not found`, status: 400});
                }
            },
            PUT: async req => {
                const topic = await req.json() as BodyResult;
                await sql `UPDATE topics 
                            SET parent_topic_id = ${topic.parent_topic_id}, 
                            topic_name = ${topic.topic_name}, 
                            topic_notes = ${topic.topic_notes}
                            WHERE topic_id = ${req.params.id}`;
                return Response.json({ message: "Topic updated", status: 204 });
            },
            DELETE: async req => {
                await sql `DELETE FROM topics WHERE topic_id = ${req.params.id}`;
                return Response.json({ message: "Topic deleted", status: 204 });
            }
        },
        "/api/topics/:parentId/subTopics": {
            GET: async req => {
                const results = await sql`SELECT * FROM topics WHERE parent_topic_id = ${req.params.parentId}`.values();
                
                return Response.json({
                    results
                });
            },
            DELETE: async req => {
                await sql `DELETE FROM topics WHERE parent_topic_id = ${req.params.parentId}`;
                return Response.json({ message: "Topic deleted", status: 204 });
            }
        }
    },
    fetch() {
        return new Response("Not found", { status: 404 });
    }
});

console.log("Hello via Bun!");