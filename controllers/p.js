/* get single player */
app.get('/players/:id', async (req, res) => {
    return await commitToDb(
        prisma.player.findUnique({
            select: {
                id: true,
                name: true,
                team: true, 
                goals: true, 
                assists: true,
                content: true,
                fanpoints: true,
            comments: {
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    // ...COMMENT_SELECT_FIELDS,
                }
             },
           /*   likes: {
              orderBy: {
                userId: 'desc'
              },
              select: {
                _count: { select: { likes: true } }
              }
             } */
            }
        })
        .then(async player => {
            const likes = await prisma.like.findMany({
                where: {
                    userId: req.cookies.userId,
                    commentId: { in: player.comments.map(comment => comment.id) }
                }
            })

        return {
            ...player,
            comments: player.comments.map(comment => {
                const { _count, ...commentFields } = comment 
                return {
                    ...commentFields,
                    likedByMe: likes.find(like => like.commentId === comment.id),
                    likeCount: _count.likes 
                }
            })
          }
        })
    )
})