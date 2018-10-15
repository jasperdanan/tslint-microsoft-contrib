import * as ts from 'typescript';
import * as Lint from 'tslint';

/**
 * @deprecated
 * The type checker is stable enough now that we don't need to wrap around it.
 * You should directly extend Lint.AbstractRule yourself.
 * @see https://github.com/Microsoft/tslint-microsoft-contrib/issues/556
 */
export class ErrorTolerantWalker extends Lint.RuleWalker {

    public static DEBUG: boolean = false;

    protected visitNode(node: ts.Node): void {
        try {
            super.visitNode(node);
        } catch (e) {
            // turn this on when trying out new rules on foreign codebases
            if (ErrorTolerantWalker.DEBUG) {
                const msg: string = 'An error occurred visiting a node.'
                    + '\nWalker: ' + this.getClassName()
                    + '\nNode: ' + (node.getFullText ? node.getFullText() : '<unknown>')
                    + '\n' + e;

                this.addFailureAt(
                    node.getStart ? node.getStart() : 0,
                    node.getWidth ? node.getWidth() : 0,
                    msg);
            }
        }
    }

    private getClassName(): string {
        // Some versions of IE have the word "function" in the constructor name and
        // have the function body there as well. This rips out and returns the function name.
        const result: string = this.constructor.toString().match(/function\s+([\w\$]+)\s*\(/)![1] || '';
        if (result == null || result.length === 0) {
            throw new Error('Could not determine class name from input: ' + this.constructor.toString());
        }
        return result;
    }

}