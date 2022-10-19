import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

import { setContext } from '@apollo/client/link/context';
import { environment } from 'environments/environment';

const uri = environment.graphQLUrl;

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> 
{
    const basic = setContext(() => ({
        headers: {
            Accept: 'charset=utf-8'
        }
    }));

    const auth = setContext(() => {
        const token = localStorage.getItem(environment.LOCAL_STORAGE_TOKEN);
        if (token === null)
        {
            return {};
        }
        else
        {
            return {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        };
    });

    const link = ApolloLink.from([basic, auth, httpLink.create({uri})]);
    return {
        link: link,
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
            },
        }
    };
}

@NgModule({
    providers: [
    {
        provide: APOLLO_OPTIONS,
        useFactory: createApollo,
        deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {}
