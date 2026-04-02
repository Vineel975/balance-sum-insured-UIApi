Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.ts(2322)
type_utils.d.ts(11, 97): The expected type comes from property 'claimId' which is declared here on type '{ tariffStorageId?: Id<"_storage"> | undefined; tariffFileName?: string | undefined; claimId: string; hospitalStorageId: Id<"_storage">; hospitalFileName: string; }'


Type 'string | undefined' is not assignable to type 'Id<"_storage"> | undefined'.
  Type 'string' is not assignable to type 'Id<"_storage">'.
    Type 'string' is not assignable to type '{ __tableName: "_storage"; }'.ts(2322)
type_utils.d.ts(11, 97): The expected type comes from property 'tariffStorageId' which is declared here on type '{ tariffStorageId?: Id<"_storage"> | undefined; tariffFileName?: string | undefined; claimId: string; hospitalStorageId: Id<"_storage">; hospitalFileName: string; }'



Type 'string | undefined' is not assignable to type 'string'.
Type 'undefined' is not assignable to type 'string'.ts(2322)
type_utils.d.ts(11, 97): The expected type comes from property 'claimId' which is declared here on type '{ tariffStorageId?: Id<"_storage"> | undefined; tariffFileName?: string | undefined; claimId: string; hospitalStorageId: Id<"_storage">; hospitalFileName: string; }'


ype 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.ts(2322)
type_utils.d.ts(11, 97): The expected type comes from property 'claimId' which is declared here on type '{ tariffStorageId?: Id<"_storage"> | undefined; tariffFileName?: string | undefined; claimId: string; hospitalStorageId: Id<"_storage">; hospitalFileName: string; }'
Type 'FunctionReference<"query", "public", { jobId: Id<"processJob">; }, { _id: Id<"processJob">; status: string; completed: number; total: number; successCount: number; errorCount: number; totalCost: number; ... 8 more ...; logs: { ...; }[]; } | null, string | undefined>' does not satisfy the constraint '(...args: any) => any'.
  Type 'FunctionReference<"query", "public", { jobId: Id<"processJob">; }, { _id: Id<"processJob">; status: string; completed: number; total: number; successCount: number; errorCount: number; totalCost: number; ... 8 more ...; logs: { ...; }[]; } | null, string | undefined>' provides no match for the signature '(...args: any): any'.ts(2344)
(property) getJobById: FunctionReference<"query", "public", {
    jobId: Id<"processJob">;
}, {
    _id: Id<"processJob">;
    status: string;
    completed: number;
    total: number;
    successCount: number;
    errorCount: number;
    totalCost: number;
    totalTokens: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    isComplete: boolean;
    error: string | undefined;
    claimId: string | undefined;
    files: {
        file: string;
        status: string;
        cost: number | undefined;
        tokens: number | undefined;
        timeMs: number | undefined;
        statusMessage: string | undefined;
        storageId: Id<"_storage"> | undefined;
        fileName: string | undefined;
        fileType: "hospitalBill" | ... 2 more ... | undefined;
    }[];
    results: {
        ...;
    }[];
    logs: {
        ...;
    }[];
} | null, string | undefined>
