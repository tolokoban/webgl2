type ITask = () => Promise<void>

export default class UpdateTasks {
    private nxtTask?: ITask
    private curTask?: ITask
    private actionRunning = false

    /**
     * This class prevent two tasks to be executed in parallel.
     * So, the tasks are queued. But this is a smashing-queue.
     * Which means that the queue keeps only two elements,
     * the first one and the last one.
     */
    exec(task: ITask) {
        if (this.curTask) {
            this.nxtTask = task
        } else {
            this.curTask = task
        }
        if (!this.actionRunning) this.action()
    }

    private async action() {
        this.actionRunning = true
        try {
            while (this.curTask) {
                try {
                    await this.curTask()
                } catch (ex) {
                    console.error("[UpdateTasks]", ex)
                }
                this.curTask = this.nxtTask
            }
        } finally {
            this.actionRunning = false
        }
    }
}
