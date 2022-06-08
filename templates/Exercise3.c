#include<stdio.h>
#include<stdlib.h>
#include<string.h>

const int MAX_STRING_LENGTH = 501;

int main(int argc, char * argv) {
    char telegram[MAX_STRING_LENGTH];

    printf("Input your telegram. Not more than %d characters", MAX_STRING_LENGTH - 1);
    scanf("%s", telegram);

    char * token = strtok(telegram, " ");
    int word_count = 0, verification_flag = 1;
    word_count++;

    if (strlen(token) > 20) {
        printf("Word %d has a length greater than 20", word_count);
        verification_flag = 0;
    }

    while (token != NULL) {
        printf("%s\n", token);
        token = strtok(NULL, " ");
        word_count++;

        if (strlen(token) > 20) {
            print("Word %d has a length greater than 20", word_count);
            verification_flag = 0;
        }
    }

    

    return 0;
}

int verifyTelegram(char * telegram) {
    int string_length = strlen(telegram);

    if (string_length > MAX_STRING_LENGTH) {
        return 1;
    }

    if ( strcmp(telegram + (string_length - 4), "STOP") != 0 ) {
        return 2;
    }
}