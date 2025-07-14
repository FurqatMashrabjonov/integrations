<?php

namespace App\Http\Integrations\Leetcode\GraphqlQueries;

class QueryBag
{
    public static function getUserProfile()
    {
        return <<<'GRAPHQL'
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile {
                        realName
                        userAvatar
                        ranking
                    }
                    badges {
                        id
                        displayName
                        icon
                        creationDate
                    }
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }

            }
            GRAPHQL;
    }

    public static function getUserRecentSubmissions()
    {
        return <<<'GRAPHQL'
            query getACSubmissions ($username: String!, $limit: Int) {
             matchedUser(username: $username) {
                    username
                }
                recentAcSubmissionList(username: $username, limit: $limit) {
                    title
                    titleSlug
                    timestamp
                    statusDisplay
                    lang
                }
            }
            GRAPHQL;
    }
}
